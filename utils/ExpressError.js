    class ExpressError extends Error{

        constructor(status,message,extra={}){
            super();
            this.status=status;
            this.message=message;
            Object.assign(this,extra)
        }
    }
    export default ExpressError;
    