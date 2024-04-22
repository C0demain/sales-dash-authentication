export default class NotFoundError extends Error{
    name: string;
    message: string;
    cause?: any
    
    constructor(message: string){
        super()
        this.name = "UserNotFound"
        this.message = message
    }
}