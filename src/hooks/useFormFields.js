import React, {useCallback} from "react";

const useFormFields = (initialValue = {}) => {
    const [value, setValue] = React.useState(initialValue);
    const onChange = useCallback((e) => {
        const newVal = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setValue({
            ...value,
            [e.target.name]: newVal
        })
    }, []);
    return { value, onChange };
};
export default useFormFields;