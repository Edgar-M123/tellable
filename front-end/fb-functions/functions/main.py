import asyncio
import json
from typing import List, Tuple, TypedDict, Union
import logging

from firebase_admin import initialize_app #type: ignore
from firebase_functions import https_fn, params #type: ignore
from google.api_core.exceptions import GoogleAPIError
import google.generativeai as genai
from pydantic import BaseModel, ValidationError

gemini_api_key = params.SecretParam("GEMINI_API_KEY")


logger = logging.getLogger('cloudfunctions.googleapis.com/cloud-functions')
logger.setLevel(logging.INFO)
logger.addHandler(logging.StreamHandler())

logger.info("logger ready")

# Type definitions
class GeminiResponse(BaseModel):
    title: str
    story: str
    tags: List[str]
    emotions: List[str]
    searchable_text: str

class ErrorResponse(BaseModel):
    error: str
    message: str
    status: int

# Initialize Firebase app
initialize_app()

# def setup_gemini(api_key: Optional[str] = None) -> None:
#     """Setup Gemini API with provided API key or default credentials."""
genai.configure(api_key=gemini_api_key.value) #type: ignore
model = genai.GenerativeModel(model_name="gemini-2.0-flash") # type: ignore

tags = ["Funny", "Surprising", "Heartwarming", "Inspiring", "Awkward", "Work", "Family", "Friends", "Travel", "Life Lesson"]

# Prompt engineering for Gemini
GEMINI_PROMPT = """
Analyze the following text and extract or generate the following information:
1. A concise, engaging title

2. An engaging story based on the input text. The input text is typically made up of someones notes of something they experienced.
    Your job is to enhance the notes so that the story can be told in an engaging way. 
    The story will be used in regular conversation. Try to make it sound as natural as possible, like how a normal person would talk.
    Feel free to add line breaks to make the story read well.

3. A list of relevant tags (3-5 tags). You can only use the following tags: {tags}

4. A list of emotions conveyed in the text (2-3 primary emotions).

5. Searchable text that summarizes the key elements.

Format your response as a JSON object with the following structure:
{{
  "title": "Title here",
  "story": "Enhanced or generated story here",
  "tags": ["tag1", "tag2", "tag3"],
  "emotions": ["emotion1", "emotion2"],
  "searchable_text": "Searchable summary here"
}}

Input text: {text_input}
"""

async def process_with_gemini(text_input: str) -> Tuple[Union[GeminiResponse, ErrorResponse], int]:
    """Process text with Gemini and return structured data.
    
    Args:
        text_input: The input text to process
        
    Returns:
        A tuple containing either the processed response or an error, and an HTTP status code
    """

    logger.info("running gemini function")

    try:
        
        # Generate the prompt with user input
        try:
            logger.info("generating prompt")
            prompt = GEMINI_PROMPT.format(text_input=text_input, tags=tags)
            logger.info("prompt: %s", prompt)
        except Exception as exc:
            logger.error(exc)
            raise exc

        # Get response from Gemini
        logger.info("asking for gemini response")
        response = model.generate_content(prompt) # type: ignore

        logger.info("full response: %s", response)
        
        # Parse the JSON from the text response
        try:
            # Extract JSON from response
            logger.info("extracting text from gemini response")
            raw_json = response.text
            logger.info("raw gemini text: %s", raw_json)
            # If the response is wrapped in markdown code blocks, extract just the JSON
            if "```json" in raw_json:
                raw_json = raw_json.split("```json")[1].split("```")[0].strip()
            elif "```" in raw_json:
                raw_json = raw_json.split("```")[1].split("```")[0].strip()
        except Exception:
            logger.info("failed to extract text")
            return ErrorResponse(
                error ="text_extraction_error",
                message= "Failed to parse JSON from Gemini response",
                status= 500
            ), 500


        try:
            logger.info("validating gemini response")
            result = GeminiResponse.model_validate_json(raw_json)
            logger.info("validated response successfully")
        except ValidationError as exc:
            logger.error("Response validation failed: %s", exc)
            return {
                "error": "incomplete_response",
                "message": f"Gemini response validation error: {exc}",
                "status": 500
            }, 500
        
        return result, 200
    
    except GoogleAPIError as e:
        logging.error(e)
        return {
            "error": "gemini_api_error",
            "message": f"Error calling Gemini API: {str(e)}",
            "status": 500
        }, 500
        
    except Exception as e:
        logging.error(e)
        return {
            "error": "unexpected_error",
            "message": f"Unexpected error: {str(e)}",
            "status": 500
        }, 500


@https_fn.on_request(secrets=[gemini_api_key])
def gemini_text_processor(req: https_fn.Request) -> https_fn.Response:
    """Firebase Gen 2 function that processes text with Gemfunctionsini.
    
    Args:
        req: The request object
        
    Returns:
        The response object with processed text data or error information
    """

    logger.info("Running function")
    logger.info("Secret value starts with: %s", gemini_api_key.value[:3])

    # Handle CORS and method validation
    if req.method == "OPTIONS":
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "3600"
        }

        logger.info("Returned options")

        return https_fn.Response(status=204, headers=headers)
    
    if req.method != "POST":
        logger.info("Bad method")
        return https_fn.Response(
            json.dumps({
                "error": "method_not_allowed",
                "message": "Only POST method is allowed",
                "status": 405
            }),
            status=405,
            headers={"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"}
        )
    
    # Validate request content
    if not req.content_type or "application/json" not in req.content_type:
        logger.info("Bad content type")
        return https_fn.Response(
            json.dumps({
                "error": "invalid_content_type",
                "message": "Content-Type must be application/json",
                "status": 400
            }),
            status=400,
            headers={"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"}
        )
    
    # Get request data
    try:
        logger.info("Getting request data")
        request_data = req.get_json()
        logger.info("Request data extracted: %s", request_data)
    except Exception:
        logger.info("Request body is not valid JSON")
        return https_fn.Response(
            json.dumps({
                "error": "invalid_json",
                "message": "Request body is not valid JSON",
                "status": 400
            }),
            status=400,
            headers={"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"}
        )
    
    # Validate input text
    
    logger.info("Validating input data")
    text_input = request_data.get("data")
    if not text_input or not isinstance(text_input, str):
        logger.info("request must include text field with string value")
        return https_fn.Response(
            json.dumps({
                "error": "invalid_input",
                "message": "Request must include 'text' field with string value",
                "status": 400
            }),
            status=400,
            headers={"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"}
        )
    
    # Process with Gemini
    response, status_code = asyncio.run(process_with_gemini(text_input))
    
    # Return response
    return https_fn.Response(
        json.dumps({"data":response.model_dump()}),
        status=status_code,
        headers={"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"}
    )