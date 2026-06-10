function serializeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phone_number,
    subscriptionStatus: user.subscription_status,
    subscriptionPlan: user.subscription_plan,
    resumeLimit: user.resume_limit,
    emailVerifiedAt: user.email_verified_at,
    lastLoginAt: user.last_login_at,
    createdAt: user.created_at,
    updatedAt: user.updated_at
  };
}

module.exports = {
  serializeUser
};
