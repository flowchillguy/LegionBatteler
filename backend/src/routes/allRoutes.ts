import express from "express";
import authRoute from './authRoute.js'

const router = express.Router();

// ============================================================ 
// PUBLIC ROUTES
// ============================================================ 
router.use('/auth', authRoute);

// ============================================================ 
// PRIVATE ROUTES
// ============================================================ 
// Cách 1: Gắn middleware bảo vệ trực tiếp vào từng luồng
// router.use('/users', protectedRoute, userRoute);
// router.use('/characters', protectedRoute, characterRoute);

/* Cách 2: Nếu bạn có quá nhiều private route, bạn có thể dùng cách này 
  để bảo vệ tất cả các route khai báo bên dưới nó:
  
  router.use(protectedRoute);
  router.use('/users', userRoute);
  router.use('/characters', characterRoute);
  router.use('/inventory', inventoryRoute);
*/



export default router