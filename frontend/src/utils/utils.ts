import { FormInstance, message } from "antd";

export function setFormErrors(form: FormInstance, e: any) {
    if(e.message || e.error) {
        message.error(e.message || e.error);
    } else {
        form.setFields(
            Object.entries(e).map(([name, errors]: any[]) => {
                return {
                    name,
                    errors
                }
            })
        );
    }
}