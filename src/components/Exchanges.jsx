import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { server } from '../index'
import { Button, Container, HStack, Heading, Image, Text, VStack } from '@chakra-ui/react';
import Loader from './Loader';
import ErrorComponent from './ErrorComponent';

const Exchanges = () => {

  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);

  const changePage = (page) => {
    setPage(page);
    setLoading(true);
  }

  const btns = new Array(6).fill(1);
  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        const { data } = await axios.get(`${server}/exchanges?page=${page}`);
        setExchanges(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    }
    fetchExchanges();
  }, [page]);

  if (error) return (<ErrorComponent message={"Error While Fetching Exchanges"} />);

  return (
    <Container maxW={'container.xl'} >
      {loading ? <Loader /> :
        <>

          <HStack wrap={'wrap'} marginTop={'20'} justifyContent={'space-evenly'} >
            {exchanges.map((i) => (
              <ExchangeCard key={i.id} name={i.name} img={i.image} rank={i.trust_score_rank} url={i.url} />
            ))}
          </HStack>
          <HStack overflowX={'auto'} marginBottom={'5'} p={'8'} justifyContent={'center'}>
            {
              btns.map((item, index) => (
                <Button key={index} bgColor={'blackAlpha.900'} color={'white'}
                  onClick={() => changePage(index + 1)}>{index + 1}</Button>
              ))
            }
          </HStack>
        </>}
    </Container>
  );
};

const ExchangeCard = ({ name, img, rank, url }) => {
  return (
    <a href={url} target={"blank"}>
      <VStack width={'52'} shadow={'xl'} p={'8'} m={'4'} borderRadius={'lg'} transition={"all 0.3s"}
        css={{
          "&:hover": {
            transform: "scale(1.1)"
          }
        }}>
        <Image src={img} h={'14'} w={'14'} objectFit={'contain'} alt={'Exchange img'} />
        <Heading size={'md'} noOfLines={1}>{rank}</Heading>
        <Text noOfLines={1}>{name}</Text>
      </VStack>
    </a>
  )
};
export default Exchanges
