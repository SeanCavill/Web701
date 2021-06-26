exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.beneficiaryBoard = (req, res) => {
  res.status(200).send("Beneficiary Content.");
};

exports.memberBoard = (req, res) => {
  res.status(200).send("Member Content.");
};
