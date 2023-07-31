const Response = {
    Status: "Failed",
    Message: "",
    Dimensions: {},
    DominantColor: {},
    Prediction: "",

    set setStatus(v) {
        this.Status = v;
    },

    set setMessage(obj) {
        this.Message = obj;
    },

    set setDimensions(obj) {
        this.Dimensions = obj;
    },

    set setDominantColor(obj) {
        this.DominantColor = obj;
    },

    set setPredictions(pred) {
        this.Prediction = pred;
    }

}

export default Response;