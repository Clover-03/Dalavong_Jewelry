const { PrismaClient, OrderStatus } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await prisma.tb_Order.findMany({
            include: {
                Tb_Supplier: true,
                Tb_Order_Product: {
                    include: {
                        Tb_Product: true,
                    },
                },
            },
            orderBy: { Order_Date: 'desc' },
        });

        // Restructure orders to match frontend expectations
        const formattedOrders = orders.map(order => {
            const products = order.Tb_Order_Product.map(detail => ({
                Pd_ID: detail.Pd_ID,
                Pd_name: detail.Tb_Product.Pd_name,
                quantity: detail.Quantity,
                buyPrice: detail.Buy_price,
                discount: detail.Discount,
                weight: detail.Tb_Product.Weight,
                patternValue: detail.Tb_Product.Pattern_value
            }));
            return {
                Order_ID: order.Order_ID,
                Order_Date: order.Order_Date,
                Sup_ID: order.Sup_ID,
                Tb_Supplier: order.Tb_Supplier,
                status: order.Status,
                products: products,
            };
        });

        const latestPrice = await prisma.tb_Price.findFirst({
            orderBy: { Date: 'desc' },
        });

        res.json({
            orders: formattedOrders,
            latestPrice: {
                Buy_price: latestPrice?.Buy_price,
                Sell_price: latestPrice?.Sell_price,
            }
        });

    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
};

// GET one order by ID
exports.getOrderById = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await prisma.tb_Order.findUnique({
            where: { Order_ID: parseInt(id) },
            include: {
                Tb_Supplier: true,
                Tb_Order_Product: {
                    include: {
                        Tb_Product: true,
                    },
                },
            },
        });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order' });
    }
};

// POST a new order
exports.createOrder = async (req, res) => {
    const { Order_Date, Sup_ID, status, products } = req.body;
    const userId = req.user?.userId;

    if (!userId || !Sup_ID || !products || !products.length) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const newOrder = await prisma.$transaction(async (tx) => {
            const order = await tx.tb_Order.create({
                data: {
                    User_ID: userId,
                    Sup_ID: Sup_ID,
                    Order_Date: new Date(Order_Date),
                    Status: status || OrderStatus.Pending,
                },
            });

            const orderDetailsData = products.map(p => ({
                Order_ID: order.Order_ID,
                Pd_ID: p.id,
                Quantity: p.quantity,
                Buy_price: p.buyPrice,
                Discount: p.discount,
            }));

            await tx.tb_Order_Product.createMany({
                data: orderDetailsData,
            });
            
            if(status === OrderStatus.Completed) {
                const productIds = products.map(p => p.id);
                await tx.tb_Product.updateMany({
                    where: { Pd_ID: { in: productIds } },
                    data: { status: 'AVAILABLE' }
                });
            }

            return order;
        });
        res.status(201).json(newOrder);
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: 'Error creating order' });
    }
};

// PUT to update an order
exports.updateOrder = async (req, res) => {
    const { id } = req.params;
    const { Sup_ID, status, products } = req.body;

    try {
        const updatedOrder = await prisma.$transaction(async (tx) => {
             const orderId = parseInt(id);

            const order = await tx.tb_Order.update({
                where: { Order_ID: orderId },
                data: { Sup_ID, Status: status },
            });

            const currentDetails = await tx.tb_Order_Product.findMany({
                where: { Order_ID: orderId }
            });

            const productIdsInUpdate = products.map(p => p.id);
            const detailsToDelete = currentDetails.filter(d => !productIdsInUpdate.includes(d.Pd_ID));
            if (detailsToDelete.length > 0) {
                 await tx.tb_Order_Product.deleteMany({
                    where: {
                        Order_ID: orderId,
                        Pd_ID: { in: detailsToDelete.map(d => d.Pd_ID) }
                    }
                 });
            }

            for (const p of products) {
                const existingDetail = currentDetails.find(d => d.Pd_ID === p.id);
                if (existingDetail) {
                    // Update existing
                    await tx.tb_Order_Product.update({
                        where: { Order_Product_ID: existingDetail.Order_Product_ID },
                        data: {
                            Quantity: p.quantity,
                            Buy_price: p.buyPrice,
                            Discount: p.discount,
                        },
                    });
                } else {
                    // Create new
                    await tx.tb_Order_Product.create({
                        data: {
                            Order_ID: orderId,
                            Pd_ID: p.id,
                            Quantity: p.quantity,
                            Buy_price: p.buyPrice,
                            Discount: p.discount,
                        }
                    });
                }
            }
            
            const allProductIdsInOrder = products.map(p => p.id);

            if (status === OrderStatus.Completed) {
                 await tx.tb_Product.updateMany({
                    where: { Pd_ID: { in: allProductIdsInOrder } },
                    data: { status: 'AVAILABLE' }
                });
            } else {
                 await tx.tb_Product.updateMany({
                    where: { Pd_ID: { in: allProductIdsInOrder } },
                    data: { status: 'SOLD' }
                });
            }

            return order;
        });

        res.json(updatedOrder);
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ message: 'Error updating order' });
    }
};

// DELETE an order
exports.deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.$transaction(async (tx) => {
            const orderId = parseInt(id);
            await tx.tb_Order_Product.deleteMany({
                where: { Order_ID: orderId },
            });
            await tx.tb_Order.delete({
                where: { Order_ID: orderId },
            });
        });

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ message: 'Error deleting order' });
    }
}; 
 