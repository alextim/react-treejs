import { FixedSizeGrid as Grid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { useAppStore } from "../../../../store";
import type { DataItem } from "@/at-shared";

const formatFloat = (n: number) => n.toFixed(2);
const formatPos = ({ pos: [x, y, z] }: DataItem) => `${formatFloat(x)}, ${formatFloat(y)}, ${formatFloat(z)}`;

const ItemList = () => {
  const { items, filtered } = useAppStore();
  const filteredItems = items.filter((item) => !item.hidden);

  const Cell  = ({ rowIndex, columnIndex, style }: { rowIndex: number, columnIndex: number, style: any }) => (
    <div className={rowIndex % 2 ? "ListItemOdd" : "ListItemEven"} style={style}>
      {columnIndex === 0 ? rowIndex : formatPos(filteredItems[rowIndex])}
    </div>
  );

  return (
    <AutoSizer>
      {({ height, width }) => (
        <Grid
          className="List"
          height={height}
          rowCount={filtered}
          rowHeight={35}
          width={width}
          columnCount={2}
          columnWidth={100}
        >
          {Cell }
        </Grid>
      )}
    </AutoSizer>
  );
};
export default ItemList;
