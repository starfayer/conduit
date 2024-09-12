import { DotLoader } from "react-spinners";
import type { LoaderSizeProps } from "react-spinners/helpers/props";

const accentColor = "#5cb85c";

export function DotLoaderComponent(props: LoaderSizeProps) {
  return (
    <div style={{
      display: props.loading === true ? "flex" : "none",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "80px"
    }}>
      <DotLoader color={accentColor} speedMultiplier={2} cssOverride={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%"
      }} {...props} />
    </div>
  )
}