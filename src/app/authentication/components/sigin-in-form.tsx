"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
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
  email: z.string().email("Formato de email inválido"),
  password: z.string().min(8, "Senha de ter no mínimo 8 caracteres."),
  rememberMe: z.boolean().optional(),
})


export default function SignInForm() {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  })

  const onSubmit = async ({ email, password, rememberMe }: z.infer<typeof formSchema>) => {
    const { data, error } = await authClient.signIn.email({
      email,
      password,
      rememberMe,
      fetchOptions: {
        onSucces: () => {
          toast.success("sucesso")
          router.push('/')
        },
        onError: (ctx) => {
          console.log("error", ctx)
          
          if(ctx.error.code == "INVALID_EMAIL_OR_PASSWORD") {
            toast.error("Usuário não encontrado ou senha inválida.")
            return
          }
          
          toast.error("Aconteceu um erro ao tentar autenticar.")
        }
      }
    });

    if(data) toast.success(`Bem vindo de volta ${data.user?.name}`)
    if(error) toast.error("Aconteceu um erro.")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Entrar</CardTitle>
            <CardDescription>
              Faça login para continuar.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
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
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <div className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-blue-50">
                    <Checkbox
                      id="rememberMe"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white"
                    />
                    <div className="grid gap-1.5 font-normal">
                      <label
                        htmlFor="rememberMe"
                        className="text-sm leading-none font-medium"
                      >
                        Lembrar de mim
                      </label>
                      <p className="text-muted-foreground text-sm">
                        Mantenha-me conectado nesta sessão.
                      </p>
                    </div>
                  </div>
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
