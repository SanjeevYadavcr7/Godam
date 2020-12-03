const User = require('../../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');
const Noty = require('noty');


function authController(){

    const _getRedirectUrl = (req) => {
        return req.user.role === 'admin' ? '/admin/orders' : '/' 
    }

    return {
        login(req,res) {
            res.render('auth/login');
        },
        register(req,res) {
            res.render('auth/register');
        },

        // creating post login method - how login works if user is found or not found
        postLogin(req,res, next){
            console.log('Inside login')
            const {email, password} = req.body
            if(!email || !password){
                req.flash('error', 'All fields are required')
                return res.redirect('/login')
            }

            passport.authenticate('local',(err, user, info) => {
                if(err){
                    // receiving data from done() callback in passport.js and message is the key
                    req.flash('error',info.message)
                    return next(err)
                }
                if(!user){
                    // if user not found during login
                    //(have a look in passport.js why ( ,false, ) ? (err,user,{:}) = ( ,false, )
                    req.flash('error',info.message)
                    return res.redirect('/login')
                }
                req.logIn(user,(err) => {
                    if(err){
                    req.flash('error',info.message)
                    return next(err)
                    }

                    return res.redirect(_getRedirectUrl(req))
                })
            })(req, res, next)
        },
        async changePwd(req,res,next){
            const {oldPassword, newPassword} = req.body
            const hash = req.user.password
            const newHashedPassword = await bcrypt.hash(newPassword, 10).catch(e => { console.log(e) })
            bcrypt.compare(oldPassword, hash, (err, isMatch) => {
                if (err || !isMatch) {
                  console.log("Password doesn't match!")
                  req.flash('error',"Old password doesn't matches")
                  return res.redirect('/customer/customerAccount/changePwd')
                } else {
                    console.log("Password changed!")
                    User.exists({email:req.user.email},(err,user) => {
                        User.updateOne({_id: req.user._id}, {password: newHashedPassword}, (err, data) => {
                            if(err){
                                console.log(err)
                            }
                            req.flash('success','Password changed successfully')
                            return res.redirect('/customer/customerAccount')
                        })
                    })
                }
              })
        },

        async postRegister(req,res){
            console.log('Hello in register')
            const { name, phone, email, password } = req.body
            // validate request
            if(!name || !phone|| !email || !password){
                req.flash('error','All fields are required')
                req.flash('name', name)
                req.flash('name', phone)
                req.flash('email', email)
                return res.redirect('/register')
            }

            // Check if email exists
            User.exists({email: email}, (err, result) => {
                if(result){
                    req.flash('error','Email already taken')
                    req.flash('name', name)
                    req.flash('name', phone)
                    req.flash('email', email)
                    return res.redirect('/register')
                }
            })
            // Check if phone number already exists
            User.exists({phone: phone}, (err, result) => {
                if(result){
                    req.flash('error','Contact Number already taken')
                    req.flash('name', name)
                    req.flash('name', phone)
                    req.flash('email', email)
                    return res.redirect('/register')
                }
            })


            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10).catch(e => { console.log(e) })
            // console.log(hashedPassword);


            // Create a user if everything is all right
            const user = new User({
                name,
                phone,
                email,
                password: hashedPassword
            })
            user.save().then((user) => {
                // Login console.log('USER = ', user);
                return res.redirect('/login')
            }).catch(err => {
                req.flash('error','Something went wrong in registration section')
                return res.redirect('/register')
            })
            // console.log(req.body) 
        },
        logout(req,res){
            // if(req.session.cart){
            // req.session.cart.totalQty = 0
            // }
            req.logout()
            return res.redirect('/login')
        }
    }    
}

module.exports = authController