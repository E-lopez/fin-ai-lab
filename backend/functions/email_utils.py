from decimal import Decimal
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from functions.utils import parse_name
from resources.kredi_logo import LOGO_BASE64
from dotenv import load_dotenv


from functions.date_utils import calculate_days_until

env = os.getenv('APP_ENV', 'dev')
load_dotenv(f".env.{env}")

FOOTER = """
    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
    <div style="text-align: center;">
        <p style="font-size: 12px; color: #777;">
            Este es un mensaje automático, por favor no respondas a este correo.<br>
            &copy; 2025 kredi latam. Todos los derechos reservados.
        </p>
    </div>
"""

def send_email(to_email: str, subject: str, body: str) -> bool:
    smtp_server = os.environ.get("SMTP_SERVER", "email-smtp.us-east-1.amazonaws.com")
    smtp_port = int(os.environ.get("SMTP_PORT", "587"))
    smtp_username = os.environ.get("SMTP_USERNAME")
    smtp_password = os.environ.get("SMTP_PASSWORD")
    from_email = os.environ.get("FROM_EMAIL")
    
    if not smtp_username or not smtp_password:
        print("SMTP credentials not configured")
        return False
    
    try:
        msg = MIMEMultipart()
        msg["From"] = from_email
        msg["To"] = "estebanlopezg7@gmail.com"  # Override recipient for testing, replace with: to_email
        msg["Subject"] = subject
        
        msg.attach(MIMEText(body, "html"))
                
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_username, smtp_password)
        server.send_message(msg)
        server.quit()
        
        print(f"Email sent successfully to {to_email}")
        return True
    except Exception as e:
        print(f"Failed to send email to {to_email}: {str(e)}")
        return False


def compose_reminder_email(borrower_name: str, amount_due: Decimal, due_date, status: str):
    days_to_due = calculate_days_until(due_date)
    soft_due_date = status == "overdue" and days_to_due < 0 and days_to_due >= -30
    hard_due_date = status == "overdue" and days_to_due < -30

    if hard_due_date:
        subject = "Recordatorio de Pago En Mora - Acción Requerida"
        content = f"""
        <div>
            <h3>Estimado/a {parse_name(borrower_name)},</h3>
            <p>Tu pago por <strong>${amount_due:,.2f}</strong> se encuentra vencido desde hace <strong>{days_to_due * -1} días</strong>.</p>
            <p>Se ha superado el período de gracia de 30 días, por lo que se activará la cláusula aceleratoria a partir del día de hoy.</p>
            <p>Por favor, contacta con nosotros a la brevedad posible para evitar acciones adicionales.</p>
        </div>
        """
    elif soft_due_date and ((days_to_due * -1) % 5 == 0 or days_to_due == -1):
        subject = "Recordatorio de Pago Vencido - Acción Requerida"
        content = f"""
        <div>
            <h3>Estimado/a {parse_name(borrower_name)},</h3>
            <p>Tu pago por <strong>${amount_due:,.2f}</strong> se encuentra vencido desde hace <strong>{days_to_due * -1} días</strong>.</p>
            <p>Ponte al día con tu pago a la brevedad posible para evitar cargos adicionales.</p>
        </div>
        """
    elif status == "upcoming" and (days_to_due == 3 or days_to_due == 1):
        subject = "Recordatorio de Pago Próximo a Vencer"
        content = f"""
        <div>
            <h3>Estimado/a {parse_name(borrower_name)},</h3>
            <p>Tu próximo pago por <strong>${amount_due:,.2f}</strong> vence el <strong>{due_date}</strong>.</p>
            <p>Por favor, asegúrate de realizar el pago antes de la fecha de vencimiento para evitar cargos por mora.</p>
        </div>
        """
    else:
        return None
    
    body = f"""
    <html>
        <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.5;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px;">
                {content}
                <p>Saludos cordiales,</p>
                <p><strong>Equipo de kredi latam Colombia</strong></p>
                {FOOTER}
            </div>
        </body>
    </html>
    """

    return {"subject": subject, "body": body}


def compose_success_email(borrower_name: str, amount_due: Decimal, total_balance: Decimal, next_payment: Decimal, next_due_date: str):
    subject = "Pago exitoso"
    content = f"""
    <div>
        <h3>Estimado/a {parse_name(borrower_name)},</h3>
        <p>Tu pago por <strong>${amount_due:,.2f}</strong> fue exitoso.</p>
        <p>El balance de tu préstamo es de <strong>${total_balance:,.2f}</strong>.</p>
        <p>Tu próxima cuota vence el <strong>{next_due_date}</strong> por un monto de <strong>${next_payment:,.2f}</strong>.</p>
        <p>¡Gracias por estar al día!</p>
    </div>
    """

    body = f"""
    <html>
        <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.5;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px;">
                {content}
                <p>Saludos cordiales,</p>
                <p><strong>Equipo de kredi latam Colombia</strong></p>
                {FOOTER}
            </div>
        </body>
    </html>
    """

    print(f"Composed success email for {borrower_name} with amount ${amount_due:,.2f}, total balance ${total_balance:,.2f}, next due date {next_due_date}")

    return {"subject": subject, "body": body}