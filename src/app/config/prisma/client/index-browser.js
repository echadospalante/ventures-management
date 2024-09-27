
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.20.0
 * Query Engine version: 06fc58a368dc7be9fbbbe894adf8d445d208c284
 */
Prisma.prismaVersion = {
  client: "5.20.0",
  engine: "06fc58a368dc7be9fbbbe894adf8d445d208c284"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  picture: 'picture',
  email: 'email',
  firstName: 'firstName',
  lastName: 'lastName',
  active: 'active',
  verified: 'verified',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  onboardingCompleted: 'onboardingCompleted',
  userDetailId: 'userDetailId'
};

exports.Prisma.XUserPreferencesScalarFieldEnum = {
  userId: 'userId',
  categoryId: 'categoryId'
};

exports.Prisma.UserDetailScalarFieldEnum = {
  id: 'id',
  gender: 'gender',
  birthDate: 'birthDate',
  municipalityId: 'municipalityId'
};

exports.Prisma.DepartmentScalarFieldEnum = {
  id: 'id',
  name: 'name',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MunicipalityScalarFieldEnum = {
  id: 'id',
  name: 'name',
  departmentId: 'departmentId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CommentScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  publicationId: 'publicationId',
  body: 'body',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EventCategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EventDonationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  eventId: 'eventId',
  amount: 'amount',
  currency: 'currency',
  createdAt: 'createdAt'
};

exports.Prisma.LocationScalarFieldEnum = {
  id: 'id',
  ventureEventId: 'ventureEventId',
  lat: 'lat',
  lng: 'lng',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  title: 'title',
  userId: 'userId',
  type: 'type',
  status: 'status',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PublicationClapScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  publicationId: 'publicationId',
  createdAt: 'createdAt'
};

exports.Prisma.PublicationContentScalarFieldEnum = {
  id: 'id',
  type: 'type',
  content: 'content',
  publicationId: 'publicationId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RoleScalarFieldEnum = {
  id: 'id',
  name: 'name',
  label: 'label',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VentureScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  coverPhoto: 'coverPhoto',
  description: 'description',
  ownerId: 'ownerId',
  active: 'active',
  verified: 'verified',
  detailId: 'detailId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.XVentureVencureCategoryScalarFieldEnum = {
  ventureId: 'ventureId',
  categoryId: 'categoryId'
};

exports.Prisma.VentureCategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VentureDetailScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VentureEventScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  coverPhoto: 'coverPhoto',
  ventureId: 'ventureId',
  startDate: 'startDate',
  endDate: 'endDate',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VenturePublicationScalarFieldEnum = {
  id: 'id',
  description: 'description',
  detailId: 'detailId',
  type: 'type',
  clapsCount: 'clapsCount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VentureSponsorshipScalarFieldEnum = {
  id: 'id',
  sponsorId: 'sponsorId',
  ventureDetailId: 'ventureDetailId',
  monthlyAmount: 'monthlyAmount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VentureSubscriptionScalarFieldEnum = {
  id: 'id',
  subscriberId: 'subscriberId',
  ventureId: 'ventureId',
  createdAt: 'createdAt'
};

exports.Prisma.XEventCategoryScalarFieldEnum = {
  eventId: 'eventId',
  categoryId: 'categoryId'
};

exports.Prisma.XUserRolesScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  roleId: 'roleId',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.NotificationType = exports.$Enums.NotificationType = {
  WELCOME: 'WELCOME',
  ACCOUNT_VERIFIED: 'ACCOUNT_VERIFIED',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  ACCOUNT_UNLOCKED: 'ACCOUNT_UNLOCKED',
  NEW_FOLLOWER: 'NEW_FOLLOWER',
  NEW_COMMENT: 'NEW_COMMENT',
  NEW_SPONSOR: 'NEW_SPONSOR',
  NEW_DONATION: 'NEW_DONATION'
};

exports.NotificationStatus = exports.$Enums.NotificationStatus = {
  READ: 'READ',
  UNREAD: 'UNREAD'
};

exports.ContentType = exports.$Enums.ContentType = {
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  ANNOUNCEMENT: 'ANNOUNCEMENT',
  ACHIEVEMENT: 'ACHIEVEMENT'
};

exports.AppRole = exports.$Enums.AppRole = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  MODERATOR: 'MODERATOR',
  NEWS_WRITER: 'NEWS_WRITER'
};

exports.PublicationType = exports.$Enums.PublicationType = {
  TEXTUAL: 'TEXTUAL',
  VIDEO: 'VIDEO',
  IMAGE: 'IMAGE',
  ANNOUNCEMENT: 'ANNOUNCEMENT',
  ACHIEVEMENT: 'ACHIEVEMENT'
};

exports.Prisma.ModelName = {
  User: 'User',
  XUserPreferences: 'XUserPreferences',
  UserDetail: 'UserDetail',
  Department: 'Department',
  Municipality: 'Municipality',
  Comment: 'Comment',
  EventCategory: 'EventCategory',
  EventDonation: 'EventDonation',
  Location: 'Location',
  Notification: 'Notification',
  PublicationClap: 'PublicationClap',
  PublicationContent: 'PublicationContent',
  Role: 'Role',
  Venture: 'Venture',
  XVentureVencureCategory: 'XVentureVencureCategory',
  VentureCategory: 'VentureCategory',
  VentureDetail: 'VentureDetail',
  VentureEvent: 'VentureEvent',
  VenturePublication: 'VenturePublication',
  VentureSponsorship: 'VentureSponsorship',
  VentureSubscription: 'VentureSubscription',
  XEventCategory: 'XEventCategory',
  XUserRoles: 'XUserRoles'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
