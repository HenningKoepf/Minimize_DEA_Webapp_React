

/**
 * Standard Zustand als Grundelement nut mit Name und className
 * @param data
 * @returns {JSX.Element}
 * @constructor
 */
const BaseNode = ({ data }) => {

    const className = data.output ? "outputNode" : "basenode";
    return(
        <>
            <div className = {className} >
                {data.label}
            </div>
        </>
    );
};
export default BaseNode;