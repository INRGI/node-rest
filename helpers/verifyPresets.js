export const verifyEmailAgainTemplate = (email, req, verificationToken) => ({
    to: email,
    subject: "Verification Token",
    html: `
      <h2>Hello, your verification token is below</h2>
      <a href="${req.protocol}://${req.get('host')}/api/users/verify/${verificationToken}">Click here to verify your account</a>
    `,
});

export const verifyEmailTemplate = (email, req, verificationToken) => ({
    to: email,
    subject: "Verification Token",
    html: `
      <h2>Hello, your verification token is below</h2>
      <a href="${req.protocol}://${req.get('host')}/api/users/verify/${verificationToken}">Click here to verify your account</a>
    `,
});
