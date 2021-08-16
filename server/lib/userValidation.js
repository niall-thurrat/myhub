export default {
  isAlphaNumericOnly: function (input) {
    var letterNumberRegex = /^[0-9a-zA-Z]+$/
    if (input.match(letterNumberRegex)) {
      return true
    }
    return false
  },
  isCorrectLengthPassword: function (input) {
    if (input.length >= 8 && input.length <= 40) {
      return true
    }
    return false
  },
  isCorrectLengthUsername: function (input) {
    if (input.length >= 6 && input.length <= 20) {
      return true
    }
    return false
  },
  isGoodPassword: function (input) {
    // at least one number, one lowercase and one uppercase letter
    // at least eight characters
    var regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/
    return regex.test(input)
  },
  isSafe: function (input) {
    var regex = /([$])/
    return !regex.test(input)
  }
}
