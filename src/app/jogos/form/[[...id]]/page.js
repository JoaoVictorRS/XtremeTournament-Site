'use client';

import Footer from "@/app/components/Footer/Footer";
import Header from "@/app/components/Header/Header";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import { FaCheck } from "react-icons/fa";
import { ImArrowRight } from "react-icons/im";
import { MdOutlineArrowBack } from "react-icons/md";
import apiESports from "@/services/apiESports";

export default function Page({ params }) {
  const route = useRouter();
  const searchParams = useSearchParams();

  const [produto, setProduto] = useState({ nome: '', descricao: '', foto: '', cover: '', generoId: '' });
  const [loading, setLoading] = useState(false);

  // Carregar dados do produto para edição, se houver um ID
  useEffect(() => {
    if (params.id) {
      setLoading(true);
      apiESports.get(`jogos/${params.id}`)
        .then(response => {
          setProduto(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Erro ao carregar dados do produto:', error);
          setLoading(false);
        });
    }
  }, [params.id]);

  // Função para salvar (criar ou atualizar) o produto
  const salvar = async (dados) => {
    try {
      if (params.id) {
        // Atualizar produto existente
        await apiESports.put(`jogos/${params.id}`, dados);
      } else {
        // Criar novo produto
        await apiESports.post('jogos/', dados);
      }
      route.push('/jogos');
    } catch (error) {
      console.error('Erro ao salvar dados do produto:', error);
    }
  };

  return (
    <>
      <Header />
      <Container>
        <div className='d-flex justify-content-center align-items-center my-3 texto-custom'>
          <h2>{params.id ? 'EDITAR PRODUTO' : 'CRIAR PRODUTO'}</h2>
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <Formik
            initialValues={produto}
            enableReinitialize
            onSubmit={values => salvar(values)}
          >
            {({
              values,
              handleChange,
              handleSubmit,
              errors,
              touched,
              setFieldValue
            }) => (
              <Form className="my-3" onSubmit={handleSubmit}>
                <Row>
                  <Col>
                    <Form.Group as={Row} className="mb-4" controlId="nome">
                      <Form.Label column sm="1"><b>Nome:</b> </Form.Label>
                      <Col sm="10">
                        <Form.Control
                          type="text"
                          name="nome"
                          value={values.nome}
                          onChange={handleChange('nome')}
                          isInvalid={touched.nome && !!errors.nome}
                        />
                        <Form.Control.Feedback type="invalid">{errors.nome}</Form.Control.Feedback>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-4" controlId="descricao">
                      <Form.Label column sm='2'><b>Descrição:</b> </Form.Label>
                      <Col sm='9'>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          name="descricao"
                          value={values.descricao}
                          onChange={handleChange('descricao')}
                          isInvalid={touched.descricao && !!errors.descricao}
                        />
                        <Form.Control.Feedback type="invalid">{errors.descricao}</Form.Control.Feedback>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-4" controlId="generoId">
                      <Form.Label column sm='2'><b>GeneroId:</b> </Form.Label>
                      <Col sm='9'>
                        <Form.Control
                          type="text"
                          name="generoId"
                          value={values.generoId}
                          onChange={handleChange('generoId')}
                          isInvalid={touched.generoId && !!errors.generoId}
                        />
                        <Form.Control.Feedback type="invalid">{errors.generoId}</Form.Control.Feedback>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="foto">
                      <Form.Label column sm='1'><b>Foto:</b> </Form.Label>
                      <Col sm='10'>
                        <Form.Control
                          type="text"
                          name="foto"
                          placeholder="Url da Foto"
                          value={values.foto}
                          onChange={handleChange('foto')}
                          isInvalid={touched.foto && !!errors.foto}
                        />
                        <Form.Control.Feedback type="invalid">{errors.foto}</Form.Control.Feedback>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="cover">
                      <Form.Label column sm='1'><b>Cover:</b> </Form.Label>
                      <Col sm='10'>
                        <Form.Control
                          type="text"
                          name="cover"
                          placeholder="Url da Capa"
                          value={values.cover}
                          onChange={handleChange('cover')}
                          isInvalid={touched.cover && !!errors.cover}
                        />
                        <Form.Control.Feedback type="invalid">{errors.cover}</Form.Control.Feedback>
                      </Col>
                    </Form.Group>

                    <div className='d-flex justify-content-center align-items-center my-5 texto-custom'>
                      <h4>PREVIEW DA FOTO E COVER <ImArrowRight size={50} /></h4>
                    </div>
                  </Col>

                  <Col>
                    <div className="d-flex justify-content-center align-items-center mt-5">
                      {values.foto ? (
                        <Image src={values.foto} alt="Preview Foto" className="imagem_produto_preview" />
                      ) : (
                        <h2 className="text-danger imagem_produto_preview_no_image">Sem Foto!</h2>
                      )}
                    </div>
                    <div className="d-flex justify-content-center align-items-center mt-5">
                      {values.cover ? (
                        <Image src={values.cover} alt="Preview Cover" className="imagem_produto_preview" />
                      ) : (
                        <h2 className="text-danger imagem_produto_preview_no_image">Sem Capa!</h2>
                      )}
                    </div>
                  </Col>
                </Row>

                <div className="text-center">
                  <Button type="submit" variant="success">
                    <FaCheck /> Salvar
                  </Button>
                  <Link href={'/jogos'} className="btn btn-danger ms-2">
                    <MdOutlineArrowBack /> Voltar
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </Container>
      <Footer />
    </>
  );
}