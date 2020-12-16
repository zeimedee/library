const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const key = require('./secret');
const auth = require('./auth');

let models = require('./library.models');
const { model } = require('mongoose');

//get all books
router.route('/books').get( async (req,res) =>{
    await models.Books.find((err,books)=>{
        if(err){
            return res.json(err)
        }else{
            return res.json(books)
        }
    });  
});


//get one book
router.route('/books/:bookId').get(async(req,res)=>{
    let id = req.params.bookId;
  await  models.Books.findById(id,(err,book)=>{
       if(err){
           return res.json(err)
       }else{
           return res.json(book)
       }
    })           
});


//get one author

router.route('/authors/:authorId').get(async(req,res)=>{
    let id = req.params.authorId;
   await models.Authors.findById(id,(err,author)=>{
        if(err){
            return res.json(err)
        }else{
            return res.json(author)
        }
    })
})


//get all authors
router.route('/authors').get(async(req,res)=>{
   await models.Authors.find(function(err,books){
        if(err){
           return res.json(err)
        }else{
           return res.json(books)
        }
    })
});


//get books by one author
router.route('/authors/:authorId/books').get(async(req,res)=>{
    let id = req.params.authorId;
   await models.Authors.findById(id,(err,books)=>{
        if(err){
            return res.json(err)
        }else{
            return res.json(books.books)
        }
    })
});


//add admin
router.route('/addAdmin').post(async(req,res)=>{
     await   models.Admin.findOne({username: req.body.username})
                    .then((admin)=>{
                        if(admin){
                            return res.json('username already exists')
                        }else{
                            let admin = new models.Admin(req.body);
                            bcrypt.genSalt(10,(err,salt)=>{
                                bcrypt.hash(admin.password, salt, (err,hash)=>{
                                    if(err) throw err;
                                    admin.password = hash;
                                    admin.save()
                                         .then(()=>{
                                             res.status(200).json({'admin':'Admin added successfully'});
                                         })
                                         .catch(()=>{
                                             res.status(400).json('admin failed to add')
                                         })
                                })
                            })

                        }
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
});



//login as admin
router.route('/admin/login').post( async (req,res)=>{
    let username = req.body.username;
    let password = req.body.password;
   await  models.Admin.findOne({username: username})
                .then((admin)=>{
                    if(!admin){
                        return res.status(400).json("admin not found")
                    }else{
                        bcrypt.compare(password, admin.password)
                              .then((ismatch)=>{
                                  if(ismatch){
                                     const payload = {
                                         id:admin._id,
                                         name: username
                                     }

                                     jwt.sign(
                                         payload,
                                         key,
                                         {
                                            expiresIn:31556926
                                         },
                                         (err,token)=>{
                                             res.json({
                                                 success: true,
                                                 token:"Bearer " + token
                                             });
                                         }
                                     )
                                  }else{
                                      res.json('password is incorrect')
                                  }
                              })
                              .catch()
                    }
                })
                .catch()
});

//verify token
router.route('/admin/verify').post(async (req,res)=>{
    try {
        const token = req.header("Authorization");
        if(!token) return res.json({token: false});
        
        const verified = jwt.verify(token, key);
        if(!verified) return res.json({verified: false});

        const user = await models.Admin.findById(verified.id);
        if(!user) return res.json({user:false});

        return res.json(user)
        
    } catch (err) {
        res.status(500).json({err:err.message})
    }
});

//add book only when logged in
router.route('/books').post(auth , async(req,res)=>{
    let book = new models.Books(req.body);
     await  book.save()
        .then(()=>{
            res.json('book added successfully')
        })
        .catch((err)=>{
            res.json({err:err.message})
        })
});

//delete book only when logged in
router.route('/books/:bookId').delete(auth, async(req,res)=>{
    let id = req.params.bookId;
   await models.Books.findByIdAndRemove(id)
                .then(()=>{
                    res.json('book deleted')
                })
                .catch((err)=>{
                    console.log(err.message)
                })
});

//add author only when logged in 
router.route('/author').post(auth, async (req,res)=>{
    let author = new models.Authors(req.body);
  await  author.save()
          .then(()=>{
              res.json('author added successfully')
          })
          .catch((err)=>{
              console.log(err.message);
          })
});

//delete author only when logged in
router.route('/author/:authorId').delete(auth, async (req,res)=>{
            let id = req.params.authorId;
            models.Authors.findByIdAndRemove(id)
                          .then(()=>{
                              res.json('Author deleted')
                          })
                          .catch((err)=>{
                              console.log(err.message);
                          })
});

module.exports = router;

