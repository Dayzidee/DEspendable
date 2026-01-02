"""
IBAN validation with checksum verification for German banking.
Uses the schwifty library for proper IBAN validation.
"""
from schwifty import IBAN
from typing import Tuple
import logging

logger = logging.getLogger(__name__)


def validate_iban(iban_string: str) -> Tuple[bool, str]:
    """
    Validate IBAN with checksum verification.
    
    Args:
        iban_string: IBAN string to validate
    
    Returns:
        Tuple of (is_valid, error_message)
        - (True, "") if valid
        - (False, error_message) if invalid
    
    Examples:
        >>> validate_iban("DE89370400440532013000")
        (True, "")
        >>> validate_iban("DE89370400440532013001")
        (False, "Ungültige IBAN-Prüfsumme")
    """
    if not iban_string:
        return False, "IBAN darf nicht leer sein"
    
    # Remove spaces and convert to uppercase
    iban_clean = iban_string.replace(' ', '').upper()
    
    try:
        # Use schwifty to validate
        iban_obj = IBAN(iban_clean)
        
        # Additional check for German IBANs
        if iban_obj.country_code == 'DE' and len(iban_clean) != 22:
            return False, "Deutsche IBAN muss 22 Zeichen lang sein"
        
        return True, ""
        
    except ValueError as e:
        error_msg = str(e)
        
        # Translate common errors to German
        if "invalid" in error_msg.lower():
            if "checksum" in error_msg.lower():
                return False, "Ungültige IBAN-Prüfsumme"
            elif "length" in error_msg.lower():
                return False, "Ungültige IBAN-Länge"
            elif "country" in error_msg.lower():
                return False, "Ungültiger Ländercode"
            else:
                return False, "Ungültige IBAN"
        
        return False, f"IBAN-Validierung fehlgeschlagen: {error_msg}"
    
    except Exception as e:
        logger.error(f"IBAN validation error: {str(e)}")
        return False, "Fehler bei der IBAN-Validierung"


def format_iban(iban_string: str) -> str:
    """
    Format IBAN with spaces every 4 characters.
    
    Args:
        iban_string: IBAN string
    
    Returns:
        Formatted IBAN string
    
    Examples:
        >>> format_iban("DE89370400440532013000")
        'DE89 3704 0044 0532 0130 00'
    """
    iban_clean = iban_string.replace(' ', '').upper()
    
    # Add space every 4 characters
    formatted = ' '.join([iban_clean[i:i+4] for i in range(0, len(iban_clean), 4)])
    
    return formatted


def get_iban_info(iban_string: str) -> dict:
    """
    Get detailed information about an IBAN.
    
    Args:
        iban_string: IBAN string
    
    Returns:
        Dictionary with IBAN information
    
    Examples:
        >>> get_iban_info("DE89370400440532013000")
        {
            'country_code': 'DE',
            'bank_code': '37040044',
            'account_code': '0532013000',
            'formatted': 'DE89 3704 0044 0532 0130 00',
            'is_valid': True
        }
    """
    is_valid, error = validate_iban(iban_string)
    
    if not is_valid:
        return {
            'is_valid': False,
            'error': error
        }
    
    try:
        iban_obj = IBAN(iban_string.replace(' ', '').upper())
        
        return {
            'country_code': iban_obj.country_code,
            'bank_code': iban_obj.bank_code,
            'account_code': iban_obj.account_code,
            'formatted': format_iban(str(iban_obj)),
            'is_valid': True,
            'bic': iban_obj.bic if hasattr(iban_obj, 'bic') else None
        }
    
    except Exception as e:
        logger.error(f"Error getting IBAN info: {str(e)}")
        return {
            'is_valid': False,
            'error': str(e)
        }


def mask_iban(iban_string: str) -> str:
    """
    Mask IBAN for display (show country code and last 4 digits).
    
    Args:
        iban_string: IBAN string
    
    Returns:
        Masked IBAN string
    
    Examples:
        >>> mask_iban("DE89370400440532013000")
        'DE•• •••• •••• •••• ••30 00'
    """
    iban_clean = iban_string.replace(' ', '').upper()
    
    if len(iban_clean) < 6:
        return iban_string
    
    # Show country code and last 4 digits
    country_code = iban_clean[:2]
    last_four = iban_clean[-4:]
    masked_middle = '•' * (len(iban_clean) - 6)
    
    masked = f"{country_code}{masked_middle}{last_four}"
    
    # Format with spaces
    return ' '.join([masked[i:i+4] for i in range(0, len(masked), 4)])
