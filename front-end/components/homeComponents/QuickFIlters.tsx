
import { View, FlatList } from "react-native"
import { ThemedText } from "../ThemedText";

export function QuickFilters() {

    return (
        <View>
            <FlatList
            data={["Funny", "Yesterday", "Dating"]}
            renderItem={({item}) => <View><ThemedText>{item}</ThemedText></View>}
            />
        </View>
    )
}