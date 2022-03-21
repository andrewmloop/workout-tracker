import React, { useEffect } from "react";

export const Settings = (props) => {

  useEffect( () => {
    props.setBannerText("Settings");
  }, []);

  return (
    <div>
      Setings
    </div>
  );
};