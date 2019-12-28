module.exports = {
    handleServerError(req:any, res:any, error:any) {
        console.log(error);
        res.status(500).json(error.message);
    }
}