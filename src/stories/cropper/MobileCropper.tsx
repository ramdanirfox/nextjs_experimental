import { useState } from 'react';
import { CropperRef, Cropper, CircleStencil } from 'react-mobile-cropper';
import 'react-mobile-cropper/dist/style.css'
import './../assets/index.css';


export interface MobileCropperProps {
    /** INFO : this component relate with react-advanced-cropper.*/
    Description?: void,
}

export const MobileCropper: React.FC<MobileCropperProps> = ({
    // links = [],
    ...props
}: MobileCropperProps) => {
    const [image, setImage] = useState(
        // 'https://images.unsplash.com/photo-1599140849279-1014532882fe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1300&q=80',
        // '/static/media/src/stories/assets/accessibility.png',
        'images/crop.jpg'
    );
    const [cropped, setCropped] = useState<any>();

    const onChange = (cropper: CropperRef) => {
        // cropper.
        console.log(cropper.getCoordinates(), cropper.getCanvas() );
        // const f = new Blob([cropper.getImage()?.arrayBuffer!], {type: "image/jpeg"});
        // console.log(f);
        // if (cropped) { URL.revokeObjectURL(cropped); }
        // const u = URL.createObjectURL(f);
        setCropped(cropper.getCanvas()?.toBlob((b) => {
             const u = URL.createObjectURL(b!);
             setCropped(u);
            //  cropper.getTransforms().rotate
        }, "image/jpeg", 0.7));
    };

    return (
        <>
        <div style={{width: "400px", height: "600px", display: "flex"}}>
            <Cropper
                boundaryClassName=''
                stencilComponent={CircleStencil}
                src={image}
                onChange={onChange} 
                className={'cropper'}
                canvas={true}
            />
            
        </div>
        <div>
            <img src={cropped} ></img>
        </div>
        </>
    );
}