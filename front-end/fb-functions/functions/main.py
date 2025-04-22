import asyncio
import json
from typing import List, Optional, Tuple, TypedDict, Union

from firebase_admin import initialize_app #type: ignore
from firebase_functions import https_fn, params #type: ignore
from google.api_core.exceptions import GoogleAPIError
import google.generativeai as genai
from pydantic import BaseModel, ValidationError

gemini_api_key = params.SecretParam("GEMINI_API_KEY")

# Type definitions
class GeminiResponse(BaseModel):
    title: str
    story: str
    tags: List[str]
    emotions: List[str]
    searchable_text: str

class ErrorResponse(TypedDict):
    error: str
    message: str
    status: int

# Initialize Firebase app
initialize_app()

def setup_gemini(api_key: Optional[str] = None) -> None:
    """Setup Gemini API with provided API key or default credentials."""
    genai.configure(api_key=gemini_api_key.value) #type: ignore


# Prompt engineering for Gemini
GEMINI_PROMPT = """
Analyze the following text and extract or generate the following information:
1. A concise, engaging title
2. A cohesive short story based on the input (if the input is already a story, enhance it). The story will be used in regular conversation.
3. A list of relevant tags (3-5 tags)
4. A list of emotions conveyed in the text (2-3 primary emotions)
5. Searchable text that summarizes the key elements

Format your response as a JSON object with the following structure:
{
  "title": "Title here",
  "story": "Enhanced or generated story here",
  "tags": ["tag1", "tag2", "tag3"],
  "emotions": ["emotion1", "emotion2"],
  "searchable_text": "Searchable summary here"
}

Input text: {text_input}
"""

async def process_with_gemini(text_input: str) -> Tuple[Union[GeminiResponse, ErrorResponse], int]:
    """Process text with Gemini and return structured data.
    
    Args:
        text_input: The input text to process
        
    Returns:
        A tuple containing either the processed response or an error, and an HTTP status code
    """
    try:
        # Set up the model
        setup_gemini()
        model = genai.GenerativeModel(model_name="gemini-2.0-flash") # type: ignore
        
        # Generate the prompt with user input
        prompt = GEMINI_PROMPT.format(text_input=text_input)
        
        # Get response from Gemini
        response = model.generate_content(prompt) # type: ignore
        
        # Parse the JSON from the text response
        try:
            # Extract JSON from response
            raw_json = response.text
            # If the response is wrapped in markdown code blocks, extract just the JSON
            if "```json" in raw_json:
                raw_json = raw_json.split("```json")[1].split("```")[0].strip()
            elif "```" in raw_json:
                raw_json = raw_json.split("```")[1].split("```")[0].strip()
        except Exception:
            return {
                "error": "text_extraction_error",
                "message": "Failed to parse JSON from Gemini response",
                "status": 500
            }, 500


        try:
            result = GeminiResponse.model_validate_json(raw_json)
        except ValidationError as exc:
            return {
                "error": "incomplete_response",
                "message": f"Gemini response validation error: {exc}",
                "status": 500
            }, 500
        
        return result, 200
    
    except GoogleAPIError as e:
        return {
            "error": "gemini_api_error",
            "message": f"Error calling Gemini API: {str(e)}",
            "status": 500
        }, 500
        
    except Exception as e:
        return {
            "error": "unexpected_error",
            "message": f"Unexpected error: {str(e)}",
            "status": 500
        }, 500


@https_fn.on_request()
def gemini_text_processor(req: https_fn.Request) -> https_fn.Response:
    """Firebase Gen 2 function that processes text with Gemini.
    
    Args:
        req: The request object
        
    Returns:
        The response object with processed text data or error information
    """
    # Handle CORS and method validation
    if req.method == "OPTIONS":
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "3600"
        }
        return https_fn.Response(status=204, headers=headers)
    
    if req.method != "POST":
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
        request_data = req.get_json()
    except Exception:
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
    text_input = request_data.get("text")
    if not text_input or not isinstance(text_input, str):
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
        json.dumps(response),
        status=status_code,
        headers={"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"}
    )