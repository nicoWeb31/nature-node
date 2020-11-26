const Tour = require('./../models/tourModel')
const catchAsync = require('./../utils/catchAsync')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


exports.checkoutSession = catchAsync(async(req,res,next) => {

    //1 current tour
    const tour = await Tour.findById(req.params.tourId)
    console.log("🚀 ~ file: bookingsController.js ~ line 10 ~ exports.checkoutSession=catchAsync ~ tour", tour)

    //Create a checkoutSession
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [
            {
                name: `${tour.name} Tour`,
                description: tour.summary,
                images: [`http://localhost:3003/img/tours/${tour.imageCover}`],
                currency: 'usd',
                quantity: 1
            }
        ]
    })

    //create a session response
    res.status(200).json({
        status: 'success',
        session
    })


})