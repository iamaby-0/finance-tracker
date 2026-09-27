

const errorResponseBody = {
    success : false,
    error : {},
    message : "Something went wrong",
    data : {}
}

const successResponseBody = {
    success : true,
    error : {},
    message : "Successfully",
    data : {}
}

module.exports = {
    errorResponseBody,
    successResponseBody
}
