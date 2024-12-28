import * as React from "react"
const AddPropertyIcon = ({selected}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={25}
    fill={selected?"white":"#1C274C"}
  >
    <path
      d="M1.63 10.87a1.63 1.63 0 0 0 0 3.26v-3.26Zm10.87 3.26a1.63 1.63 0 0 0 0-3.26v3.26Zm0-3.26a1.63 1.63 0 0 0 0 3.26v-3.26Zm10.87 3.26a1.63 1.63 0 0 0 0-3.26v3.26Zm-9.24-1.63a1.63 1.63 0 0 0-3.26 0h3.26Zm-3.26 10.87a1.63 1.63 0 0 0 3.26 0h-3.26Zm0-10.87a1.63 1.63 0 0 0 3.26 0h-3.26Zm3.26-10.87a1.63 1.63 0 0 0-3.26 0h3.26Zm-12.5 12.5H12.5v-3.26H1.63v3.26Zm10.87 0h10.87v-3.26H12.5v3.26Zm0-1.63h-1.63v.031s0 .001 0 0v.015s0 .001 0 0V23.37h3.26V12.552c0-.001 0 0 0 0v-.011s0 .001 0 0v-.002c0-.001 0 0 0 0v-.003c0-.001 0 0 0 0V12.5H12.5Zm1.63 0V1.63h-3.26V12.5h3.26Z"
    />
  </svg>
)
export default AddPropertyIcon