import React, { useMemo } from 'react';
import { View, FlatList, StyleSheet, useWindowDimensions, Platform } from 'react-native';

interface GridTableProps<T> {
    data: T[];
    renderItem: (item: T) => React.ReactNode;
    keyExtractor?: (item: T, index: number) => string;
    maxColumns?: number;
    itemSpacing?: number;
}

const GridTable = <T,>({
    data,
    renderItem,
    keyExtractor = (_, index) => index.toString(),
    maxColumns = 4,
    itemSpacing = 8,
  }: GridTableProps<T>) => {
    const { width: screenWidth } = useWindowDimensions();
  
    const numColumns = useMemo(() => {
      if (Platform.OS === 'web') {
        if (screenWidth > 1024) return Math.min(4, maxColumns);
        if (screenWidth > 768) return Math.min(3, maxColumns);
        return Math.min(2, maxColumns);
      }
      return screenWidth > 600 ? Math.min(3, maxColumns) : 2;
    }, [screenWidth, maxColumns]);
  
    return (
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <View style={{ padding: itemSpacing / 2, width: `${100 / numColumns}%` }}>
            {renderItem(item)}
          </View>
        )}
        keyExtractor={keyExtractor}
        numColumns={numColumns}
        contentContainerStyle={{ padding: itemSpacing / 2 }}
        columnWrapperStyle={numColumns > 1 ? { marginHorizontal: -itemSpacing / 2 } : null}
      />
    );
  };
  
  export default GridTable;