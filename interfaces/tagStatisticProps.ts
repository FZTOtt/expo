import { ImageSourcePropType } from "react-native";

export interface TagStatisticProps {
    tag: string;
    completedCount: number;
    totalCount: number;
    backgroundImage: ImageSourcePropType;
}