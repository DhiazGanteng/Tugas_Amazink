export const ROLES = Object.freeze({ USER: "USER", PM_IT: "PM_IT", STAFF_IT: "STAFF_IT" });

export const roleLabel = (role) => ({
  [ROLES.USER]: "User",
  [ROLES.PM_IT]: "Project Manager",
  [ROLES.STAFF_IT]: "Staff IT",
}[role] || "User");

export const isProjectManager = (user) => user?.role === ROLES.PM_IT;
export const isStaffIt = (user) => user?.role === ROLES.STAFF_IT;
export const canCreateTicket = (user) => user?.role === ROLES.USER;
