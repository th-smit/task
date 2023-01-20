const success = (successMessage,res) => {
    res.status(200).json({ successMessage })
}

const error = (errorMessage,res) => {
    res.status(500).json({ errorMessage })
}

module.exports = {
    success,
    error
}