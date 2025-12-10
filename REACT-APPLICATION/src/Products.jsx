import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Container,
  Box,
} from '@mui/material';

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get('https://fakestoreapi.com/products')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography
        variant="h4"
        align="center"
        fontWeight="bold"
        gutterBottom
      >
        Our Products
      </Typography>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 3,
                boxShadow: 4,
                transition: '0.3s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 8,
                },
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ p: 2 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.title}
                  sx={{
                    objectFit: 'contain',
                  }}
                />
              </Box>

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {product.title}
                </Typography>

                {/* Multi-line Description */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    lineHeight: 1.6,
                    maxHeight: '4.8em',
                    overflow: 'hidden',
                  }}
                >
                  {product.description}
                </Typography>

                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  color="primary"
                >
                  Price: ${product.price}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Products;
