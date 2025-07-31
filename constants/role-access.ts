export const routeAccessMap = {
  "/superadmin": ["superadmin"],
  "/tenants": ["shopAdmin"],
  "/staff": ["staff"],
  "/common": ["shopAdmin", "staff", "superadmin"],
};

export const ROLES = {
  SUPERADMIN: "superadmin",
  STAFF: "staff",
  TENANT: "tenants",
};
