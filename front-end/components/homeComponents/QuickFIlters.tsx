
import { View, FlatList } from "react-native"
import { ThemedText } from "../ThemedText";

export function QuickFilters() {

    console.log("Rendering QuickFilters")

    return (
        <View>
            <FlatList
            data={["Funny", "Yesterday", "Dating"]}
            renderItem={({item}) => <View><ThemedText>{item}</ThemedText></View>}
            />
        </View>
    )
}