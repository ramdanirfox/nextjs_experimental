import { useState } from 'react';
import { CropperRef, Cropper } from 'react-mobile-cropper';
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
        '/static/media/src/stories/assets/accessibility.png',
    );

    const onChange = (cropper: CropperRef) => {
        console.log(cropper.getCoordinates(), cropper.getCanvas());
    };

    return (
        <div style={{width: "400px", height: "600px", display: "flex"}}>
            <Cropper
                boundaryClassName=''
                src={image}
                onChange={onChange}
                className={'cropper'}
            />
        </div>
    );
}