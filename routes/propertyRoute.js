const Property = require ('../models/property')
const UserModel = require ('../models/user')
const propertyRoute = require ('express').Router()
const verifyToken = require ('../middleware/verifyToken')



//GET ALL PROPERTIES  OK FUNZIONA//

propertyRoute.get ('/getAll', async (req, res) => {
    try {
        const properties = await Property.find({})
        return res.status(200).json (properties)
    } catch (error) {
        return res.status(500).json (error.message)
    }
})

// GET LATEST  OK FUNZIONA//

propertyRoute.get('/find/latest', async (req, res) => {
    try {
        const latestProperties = await Property.find ({latest:true}).populate('seller')
        return res.status(200).json (latestProperties)
    
    } catch (error) {
        return res.status(500).json (error.message)
    }
})

//GET BY TYPE OK FUNZIONA//

propertyRoute.get ('/find', async (req, res) => {
    const type = req.query
    try {
        if (type) {
            const properties = await Property.find(type).populate ('seller')
            return res.status(200).json (properties)
        } else {
            return res.status(500).json ({message: 'This type is not present'})
        }
    } catch (error) {
       return res.status(500).json (error.message) 
    }
})

//GET BY ID  OK FUNZIONA//

propertyRoute.get ('/find/:id', async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate ('seller')
        if (!property) {
            throw new Error ('There is no property with this id')
        } else {
            return res.status(200).json (property)
        }
    } catch (error) {
        return res.status(500).json (error.message)
    }
})

//POST NEW PROPERTY OK FUNZIONA//
propertyRoute.post('/', verifyToken, async (req, res) => {
    try {
      const user = await UserModel.findOne({ _id: req.body.seller });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const postData = new Property({
        seller: user._id,
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        img: req.body.img,
        price: req.body.price,
        squaremeters: req.body.squaremeters,
        location: req.body.location,
        bedrooms: req.body.bedrooms
      });
  
      const newProperty = await postData.save();
      await UserModel.updateOne({ _id: user._id }, { $push: { newProperty } });
  
      return res.status(200).json(newProperty);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  });
  

//MODIFY A PROPERTY  OK FUNZIONA//

propertyRoute.patch('/:id', verifyToken, async (req, res) => {
    try {
      const property = await Property.findById(req.params.id);
  
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }
  
      if (property.seller.toString() !== req.user.id) {
        return res.status(403).json({ error: "You don't have permission to make changes" });
      }
  
      const updatedProperty = await Property.findByIdAndUpdate(req.params.id, req.body, {
        new: true
      });
  
      return res.status(200).json(updatedProperty);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  });
  

//DELETE A PROPERTY  OK FUNZIONA//

propertyRoute.delete('/:id', verifyToken, async (req, res) => {
    try {
      const property = await Property.findById(req.params.id);
  
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }
  
      if (property.seller.toString() !== req.user.id) {
        return res.status(403).json({ error: "You don't have permission to delete" });
      }
  
      await property.deleteOne();
  
      return res.status(200).json({ message: 'Property successfully deleted' });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  });
  
  

module.exports = propertyRoute