import { useState } from 'react';
import { CropperRef, Cropper } from 'react-mobile-cropper';
import Select from 'react-select'


export interface ReactSelectProps {
    /** INFO : this component relate with react-advanced-cropper.*/
    Description?: void,
}

const Checkbox = ({ children, ...props }: JSX.IntrinsicElements['input']) => (
    <label style={{ marginRight: '1em' }}>
        <input type="checkbox" {...props} />
        {children}
    </label>
);

const colourOptions: readonly any[] = [
    { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
    { value: 'blue', label: 'Blue', color: '#0052CC', isDisabled: true },
    { value: 'purple', label: 'Purple', color: '#5243AA' },
    { value: 'red', label: 'Red', color: '#FF5630', isFixed: true },
    { value: 'orange', label: 'Orange', color: '#FF8B00' },
    { value: 'yellow', label: 'Yellow', color: '#FFC400' },
    { value: 'green', label: 'Green', color: '#36B37E' },
    { value: 'forest', label: 'Forest', color: '#00875A' },
    { value: 'slate', label: 'Slate', color: '#253858' },
    { value: 'silver', label: 'Silver', color: '#666666' },
];

export const ReactSelect: React.FC<ReactSelectProps> = ({
    // links = [],
    ...props
}: ReactSelectProps) => {
    const [isClearable, setIsClearable] = useState(true);
    const [isSearchable, setIsSearchable] = useState(true);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isRtl, setIsRtl] = useState(false);

    return (
        <>
            <Select
                className="basic-single"
                classNamePrefix="select"
                defaultValue={colourOptions[0]}
                isDisabled={isDisabled}
                isLoading={isLoading}
                isClearable={isClearable}
                isRtl={isRtl}
                isSearchable={isSearchable}
                name="color"
                options={colourOptions}
            />

            <div
                style={{
                    color: 'hsl(0, 0%, 40%)',
                    display: 'inline-block',
                    fontSize: 12,
                    fontStyle: 'italic',
                    marginTop: '1em',
                }}
            >
                <Checkbox
                    checked={isClearable}
                    onChange={() => setIsClearable((state) => !state)}
                >
                    Clearable
                </Checkbox>
                <Checkbox
                    checked={isSearchable}
                    onChange={() => setIsSearchable((state) => !state)}
                >
                    Searchable
                </Checkbox>
                <Checkbox
                    checked={isDisabled}
                    onChange={() => setIsDisabled((state) => !state)}
                >
                    Disabled
                </Checkbox>
                <Checkbox
                    checked={isLoading}
                    onChange={() => setIsLoading((state) => !state)}
                >
                    Loading
                </Checkbox>
                <Checkbox checked={isRtl} onChange={() => setIsRtl((state) => !state)}>
                    RTL
                </Checkbox>
            </div>
        </>
    )
}