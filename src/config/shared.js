import { StyleSheet } from 'react-native';

//API related details
 export const BASE_URL = 'https://www.testeme.test'; 
export const API_URL = 'https://www.testeme.test/api/';


//API URLs
export const LOGIN_URL = 'mobile/login';
export const FORGET_URL = 'mobile/forget';
export const SIGNUP_URL = 'mobile/signup';

//OLD API
// public static final String SAVE_INVOICE = baseUrl + "save_invoice";
// public static final String INVOICE_LIST = baseUrl + "list_invoice";
//NEW API
export const GET_INVOICE_URL = 'invoice/';

export const SIGNUP_UPDATE_URL = 'mobile/updatesignup';
export const P_INFO_UPDATE_URL = 'mobile/doctor_update';

//OLD API
//public static final String ALL_PRACTICES = baseUrl + "all_practices";
//NEW API
export const GET_ALL_PRACTICES = 'practice/';

//OLD API
// public static final String JOB_By_PRACT = baseUrl + "job_by_practices";
//NEW API
export const GET_JOBBYPRACTICE_URLPART1 = "job/";
export const GET_JOBBYPRACTICE_URLPART2 = "/practice/";

export const IMAGE_PATH = BASE_URL + 'uploads/profile/';
export const GET_ALL_DOCS = 'mobile/document/';
export const PAYMENT_UPDATE = 'mobile/doctor_update/';

export const GET_MY_JOBS_URL1 = 'doctor/';
export const GET_MY_JOBS_URL2 = '/job';

//OLD API
// public static final String MY_JOBS = baseUrl + "myjob";
//NEW API
export const GET_ALLJOBS = 'myjob/';

export const GET_FINANCIAL_REPORT = 'mobile/financial_report/';
//OLD API
// public static final String MY_PRACTICES = baseUrl + "my_practices";
//New API
export const MY_PRACTICES_PART1 = 'doctor/';
export const MY_PRACTICES_PART2 = '/practice';

//OLD API
//public static final String PDF_UPLOAD = baseUrl + "export_pdf";
//New API
export const FINANCIAL_SHARE_PDF = 'mobile/expense_mail/';
//OLD API
//public static final String CSV_UPLOAD = baseUrl + "export_csv";
//New API
export const FINANCIAL_SHARE_CSV = 'mobile/expense_csv/';

//OLD API
//public static final String ADD_JOB = baseUrl + "doctor_own_job";
//New API
export const POST_JOB_PART1 = 'doctor/'; //<user_id>
export const POST_JOB_PART2 = '/job';

//New API
export const INVOICE_EMAIL = "/email";

//OLD API
// public static final String EXP_LIST = baseUrl + "expenselist";
//New API
// export const GET_EXPENSES = 'mobile/myexpense/';
export const GET_EXPENSES = 'myexpense/';

//OLD API
// public static final String ADD_EXP = baseUrl + "upload_expense";
//New API
// export const ADD_EXPENSES = 'mobile/create_expense/';
export const ADD_EXPENSES = 'expense/';

//OLD API
// public static final String DELETE_Expense = baseUrl + "edit_expense";
//New API
// export const UPDATE_EXPENSES = 'mobile/update_expense/';

//OLD API
// public static final String EDIT_Expense = baseUrl + "delete_expense";
//New API
export const DELETE_EXPENSES = 'mobile/delete_expense/';

export const EXPENSES_IMAGE_PATH = BASE_URL + 'uploads/expense/';

//New API
export const UPLOAD_CERTIFICATES = 'mobile/upload_doc/';

//certificate uploaded path
export const DOCUMENT_PATH = BASE_URL + 'uploads/documents/';

//OLD API
// public static final String MSG_LIST = baseUrl + "user_list";
//New API
export const GET_ALL_MESSAGES = 'mobile/user_list/';

//OLD API
// public static final String Send_Msg = baseUrl + "sendmessage";
//New API
export const SEND_MESSAGE = 'mobile/message/';

export const READ_MESSAGE = 'message/';

//OLD API
// public static final String All_Msg = baseUrl + "allmessage";
//New API
export const GET_MESSAGE = 'mobile/message_passed/';

//OLD API
// public static final String ADD_PRACTICES = baseUrl + "add_practices";
//New API
export const ADD_PRACTICE = 'mobile/add_practice/';
//OLD API
//public static final String EDIT_PRACTICES = baseUrl + "edit_practice";
//New API
export const EDIT_PRACTICE = 'edit_practice/';
//OLD API
// public static final String DELETE_PRACTICE = baseUrl + "delete_practice";
//New API
export const DELETE_PRACTICE = 'mobile/delete_practice/';

export const JOB_SEARCH = '/search';

export const REVENUE_SUMMARY = 'mobile/earnings_monthly/';
export const REVENUE_DETAILS = 'earning/';

//New API
export const APPLY_FOR_JOB_PART_1 = "job/";
export const APPLY_FOR_JOB_PART_2 = "/apply/";
//OLD API
// public static final String Apply_JOb = baseUrl + "applyforjob";

export const MP_JOBS = "mobile/show_mpjob/";

export const CALENDAR = "mobile/mybooking/";

export const CANCEL_JOB = "mobile/cancel_bid/";

export const CHECK_DOCUMENTS = "mobile/get_flags/";

export const MYJOBS = 'myjob_combined/';

export const VALIDATE_EMAIL = 'email_exists/';

export const MILEAGE_CALCULATE = 'mileage/doctor/';

export const IMAGE_EXISTS = 'if_exists/';

export const PRACTICE_DETAILS = 'mp/';


export const GOOGLE_API_KEY = ""; 
// map key is on android manifest

export const WEB_CLIENT_ID = ""





