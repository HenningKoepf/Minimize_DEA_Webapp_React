import styled, { css } from "styled-components";
export const MenuContextContainer = styled.div`
  border: 1px solid #ffffff2d;
  border-radius: 4px;
  padding: 18px;
  margin: 5px 0;
  backgroundcolor: skyblue;
  box-sizing: border-box;
`;
export const ContextMenu = styled.div`
  position: absolute;
  width: 100px;
  background-color: #383838;
  border-radius: 5px;
  box-sizing: border-box;
  ${({ top, left }) => css`
    top: ${top}px;
    left: ${left}px;
  `}
  ul {
    box-sizing: border-box;
    padding: 10px;
    margin: 0;
    list-style: none;
  }
  ul li {
    padding: 18px 12px;
  }
  /* mouse hover over */
  ul li:hover {
    cursor: pointer;
    background-color: #000000;
  }
`;