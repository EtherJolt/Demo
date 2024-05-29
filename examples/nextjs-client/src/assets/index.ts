import Success from "@/assets/utils/check-circle-fill.svg";
import Invalid from "@/assets/utils/x-circle-fill.svg";

type HtmlSVG = {
	blurHeight: number
	blurWidth: number
	height: number
	src: string
	width: number
}

/** NETWORKS */
const images = {
	Success: Success as HtmlSVG, 
	Invalid: Invalid as HtmlSVG,
}
export default images;