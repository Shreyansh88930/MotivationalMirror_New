// components/CloudImage.tsx
import React from "react";
import { Image, Transformation } from "cloudinary-react";

const CloudImage = ({ publicId }: { publicId: string }) => {
  return (
    <Image cloudName="detnvovel" publicId={publicId}>
      <Transformation width="300" crop="scale" />
    </Image>
  );
};

export default CloudImage;
