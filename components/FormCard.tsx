import { useForm, FormProvider } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const FormCard = () => {
    const formMethods = useForm();

    const onSubmit = async (data: any) => {
        try {
            const response = await fetch('/api/email.ts', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const json = await response.json();

            console.log('Email created successfully', response.data);
        } catch (error) {
            console.error('Error creating email', error);
        }
    };

    return (
        <FormProvider {...formMethods}>
            <Form onSubmit={formMethods.handleSubmit(onSubmit)}>
                <Card className="grow basis-0">
                    <CardHeader>
                        <CardTitle>Email Configuration</CardTitle>
                        <CardDescription>Configure your temporary email</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormField
                                name="firstName"
                                render={({ field }) => <Input {...field} placeholder="Enter your first name" />}
                            />
                            <FormMessage />
                        </FormItem>

                        <FormItem>
                            <FormLabel>Email Duration</FormLabel>
                            <FormField
                                name="duration"
                                render={({ field }) => (
                                    <Select {...field}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select email duration" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="10min">10 minutes (100 sats)</SelectItem>
                                            <SelectItem value="1hr">1 hour (200 sats)</SelectItem>
                                            <SelectItem value="1day">1 day (500 sats)</SelectItem>
                                            <SelectItem value="1week">1 week (1000 sats)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <FormMessage />
                        </FormItem>

                        <button type="submit">Submit</button>
                    </CardContent>
                </Card>
            </Form>
        </FormProvider>
    );
};

export default FormCard;
