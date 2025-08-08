"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod/v4'

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres."),
  email: z.string().email({
    message: "Formato de email inválido"
  }),
  password: z.string().min(8, "Senha de ter no mínimo 8 caracteres."),
  passwordConfirmation: z.string().min(8, { message: "Senha deve ter no mínimo 8 caracteres." }),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "As senhas não coincidem.",
  path: ["passwordConfirmation"],
})

export default function SignUpForm() {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    }
  })

  const onSubmit = async ({ name, email, password }: z.infer<typeof formSchema>) => {
    const { data, error } = await authClient.signUp.email({
      name,
      email,
      password,
      fetchOptions: {
        onSuccess: () => {
          toast.success("Sucesso")
          router.push('/')
        },
        onError: (error) => {
          console.log("error", error)
          
          if(error.error.code == "USER_ALREADY_EXISTS") {
            form.setError("email", {
              type: "manual",
              message: "Email já cadastrado."
            })
            return
          }
          
          toast.error("Aconteceu um erro ao tentar autenticar.")
        }
      }
    });

    if(data) toast.success(`Bem vindo ${data.user?.name}`)
    if(error) toast.error("Aconteceu um erro.")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Criar conta</CardTitle>
            <CardDescription>
              Cria uma conta agora mesmo.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Fulano de tal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="user@mail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel>Confirme a Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type='submit'>Confirmar</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
