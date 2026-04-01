import { sendEmail } from "./emailService.js";

const sendEmailFun = async (to, subject, html) => {
    const result = await sendEmail(to, subject, html);
    if(result.success) {
        return true;
    } else {
        return false;
    }
    
};

export default sendEmailFun;

