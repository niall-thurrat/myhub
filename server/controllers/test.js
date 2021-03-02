const testController = (req, res) => {
  res.status(200).json({
    status: 'test Controller API call successfully'
  })
}

export default testController
