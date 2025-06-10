import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';

const contactItems = [
  {
    icon: Mail,
    title: 'Email',
    description: '',
    mailto: {
      email: 'yooputer@gmail.com',
      subject: '문의',
      body: '문의 종류:\n문의 내용:',
    },
  },
];
export default function ContactSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Me</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {contactItems.map((item, index) => (
            <a
              key={index}
              href={`mailto:${item.mailto.email}?subject=${encodeURIComponent(
                item.mailto.subject
              )}&body=${encodeURIComponent(item.mailto.body)}`}
              className="group bg-primary/5 hover:bg-muted flex items-start gap-4 rounded-lg p-3 transition-colors"
            >
              <div className="bg-primary/20 text-primary flex shrink-0 items-center justify-center rounded-md p-1.5">
                <item.icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-muted-foreground text-xs">{item.description}</p>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
