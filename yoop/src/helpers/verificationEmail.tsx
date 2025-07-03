import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    Button,

}from '@react-email/components';
// import { Http2ServerRequest } from 'http2';

interface VerificationEmailProps{
    username:string;
    otp:string;
}



interface VerificationEmailProps {
    username: string;
    otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
    return ( // ✅ Added return statement
        <Html>
            <Head>
                <title>Verification Code</title>
                <Font
                    fontFamily="Roboto"
                    fallbackFontFamily="Verdana"
                    webFont={{
                        url: 'https://fonts.gstatic.com/s/roboto/v27/KFPmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
                        format: 'woff2'
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
            </Head>
            <Preview>Here&apos;s your verification code: {otp}</Preview>
            <Section>
                <Row>
                    <Heading as="h2">Hello {username}</Heading>
                </Row>
            </Section>
            <Section>
                <Row>
                    <Text>
                        Thank you for registering. Please use the following verification code to complete your registration:
                    </Text>
                </Row>
            </Section>
            <Section>
                <Row>
                    <Text style={{ 
                        fontSize: '24px', 
                        fontWeight: 'bold', 
                        textAlign: 'center',
                        backgroundColor: '#f0f0f0',
                        padding: '20px',
                        borderRadius: '5px'
                    }}>
                        {otp}
                    </Text>
                </Row>
            </Section>
        </Html>
    );
}
// React Email components that replace table hell:

// <Container> → <table> wrapper
// <Row> → <tr>
// <Column> → <td>
// <Section> → <table> with sections
// <Text> → <p> with email-safe styling

// So <Head> is just metadata, but <Container>, <Row>, <Column> are what save you from writing table layouts manually!