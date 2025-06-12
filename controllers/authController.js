const {check,validationResult} = require("express-validator");
const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    currentPage: "login",
    isLoggedIn: false,
    oldInput: '',
    errors: []

  });
};
exports.postLogin = async (req, res, next) => {
  // res.render("auth/login", {
  //   pageTitle: "Login",
  //   currentPage: "login",

  // });
  const {email,password} = req.body;
     console.log("post Login",req.body.email)
  // wont work beacuse every req is different we marked isLoggedIn =true in postLogin so it will be undefined when redirected to /etc or other address bec browser take every req diff so it wont know in the new req that isLoggedIn was true so to use it properly you can assign it to a cookie but cookie is fucking bad to use it as an login marker bec anyone can change it in browser so session is used for login 
  // req.isLoggedIn=true;
  // now it is stored in cleint cookie so it can be accessed in any req

  //////////////////////// my ver ///////////////////
  // User.findOne({
  //   email: email
  // }).then(user => {
  //     if (!user) {
  //       return res.status(422).render("auth/login", {
  //         pageTitle: "Login",
  //         currentPage: "login",
  //         // isLoggedIn: req.isLoggedIn,
  //         //works the same
  //         error: ["user not found"],
  //         isLoggedIn: false,
  //         oldInput: {
  //           email
  //         }
  //       })
  //     } else {
  //       bcrypt.compare(password, user.password).then(isMatch => {
  //         if ( !isMatch) {
  //           return res.status(422).render("auth/login", {
  //             pageTitle: "Login",
  //             currentPage: "login",
  //             // isLoggedIn: req.isLoggedIn,
  //             //works the same
  //             error: ["user not found"],
  //             isLoggedIn:false,
  //             oldInput: {
  //               email
  //             }
  //           });
  //         } else {
  //           req.session.isLoggedIn = true;
  //           req.session.user = user
  //           req.session.save()
  //           console.log("user logged in")
  //           res.redirect('/')
  //         }
  //       })
  //     }}).catch((err) => {
  //   console.log("error while finding the user", err)
  // });


///////////////prashant ver ////////////////////////////////////
 const user = await User.findOne({email});
  if (!user) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      currentPage: "login",
      isLoggedIn: false,
      errors: ["User does not exist"],
      oldInput: {email},
      user: {},
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  console.log("ismatch",isMatch)
  if (!isMatch) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      currentPage: "login",
      isLoggedIn: false,
      errors: ["Invalid Password"],
      oldInput: {email},
      user: {},
    });
  }
 else{
  req.session.isLoggedIn = true;
  console.log("user data",user)
  req.session.user = user;
  req.session.save(()=>{

       res.redirect("/")})
     }

  

};

exports.getLogout = (req, res, next) => {

  // res.cookie("isLoggedIn",false)

  req.session.destroy(() => res.redirect('/'))
};
exports.getSignUp = (req, res, next) => {

  // res.cookie("isLoggedIn",false)

  res.render('auth/signup', {
    currentPage: "signUp",
    pageTitle: "Sign Up",
    isLoggedIn: false,
    errors: [],    
      user: {},

    oldInput: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: "",
      userType: ""
    }
  })
};


exports.postSignUp = [
  check('firstName')
  .notEmpty()
  .withMessage('First name is required')
  .trim()
  .isLength({
    min: 2
  })
  .withMessage("First Name should be atleast 2 characters long")
  .matches(/^[a-zA-Z/s]+$/)
  .withMessage("First Name should only contain alphabets"),

  check('lastName')
  .matches(/^[a-zA-Z/s]*$/)
  .withMessage("last Name should only contain alphabets"),

  check('email')
  .isEmail()
  .withMessage('Please enter a valid email')
  .normalizeEmail()
  .notEmpty(),
  check('password')
  // .notEmpty()// not need to write bec it already knows pass should not be empty
  // .withMessage('Password is required')
  .isLength({
    min: 8
  })
  .withMessage("Password should be atleast 8 characters long")
  .matches(/[A-Z]/)
  .withMessage("Password should contain atleast one uppercase letter")
  .matches(/[a-z]/)
  .withMessage("Password should contain atleast one lowercase letter")
  .matches(/[0-9]/)
  .withMessage("Password should contain atleast one number")
  .matches(/[!@#$%^&*(),.?_:{}"|<>]/)
  .withMessage("Password should contain atleast one special character")

  ,
  check('confirmPassword')
  .trim()
  .custom((value, {
    req
  }) => {
    if (value !== req.body.password) {
      throw new Error(confirmPassword = "Password do not match");
    } else {
      return true;
    }
  })

  ,
  check('userType')
  .notEmpty()
  .withMessage('User type is required')
  .isIn(['guest', 'host'])
  .withMessage('invalid user type'),
  check('terms')
  .notEmpty()
  .withMessage("Please accept the terms and conditions")
  .custom((value) => {
    if (value !== 'on') {
      throw new Error("Please accept the terms and conditions");
    } else {
      return true;
    }
  }),
  (req, res, next) => {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      userType,
      terms
    } = req.body;
    // console.log("body",req.body)
    // res.cookie("isLoggedIn",false)
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render('auth/signup', {
        pageTitle: "Signup",
        currentPage: "signup",
        isLoggedIn: false,
        errors: errors.array().map((err) => err.msg),
              user: req.user,

        oldInput: {
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
          userType
        }

      })

    }

    bcrypt.hash(password, 12).then(hashedPassword => {
      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        userType
      })
      user.save().then(() => {
        res.redirect("/login");
      }).catch(err => {
        console.log("error while saving user:", err)
        return res.status(422).render('auth/signup', {
          pageTitle: "Signup",
          currentPage: "signup",
          isLoggedIn: false,
                user: req.user,

          errors: [err.message],
          oldInput: {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            userType
          }

        })
      });
    })

    //      const user = new User({firstName,lastName,email,password,userType})
    //      user.save().then(()=>{
    //           res.redirect("/login");
    //      }).catch(err=>{
    //       console.log("error while saving user:",err)
    //  return res.status(422).render('auth/signup', {
    //         pageTitle: "Signup",
    //         currentPage: "signup",
    //         isLoggedIn: req.isLoggedIn,
    //         errors: [err.message],
    //         oldInput: {
    //           firstName,
    //           lastName,
    //           email,
    //           password,
    //           confirmPassword,
    //           userType
    //         }

    //       })     }
    //      );
    // console.log(req.body);

  }
]