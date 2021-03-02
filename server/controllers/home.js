const homeController = (req, res) => {
  res.status(200).json({
    status: 'home Controller API call successfully'
  })
}

export default homeController
