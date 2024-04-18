// Thư viện có thể được import trực tiếp vào trong project nhưng không được sử dụng do thư viện được viết sẵn
// do react-native-fast-rsa mang hiệu suất tốt hơn (do code ở cả tầng native của Android và iOS, đồng thời cũng 
// mang lại bảo mật tốt hơn (do key size có thể tuỳ chỉnh được) và sử dụng nhiều kỹ thuật phức tạp.
import { Buffer } from 'buffer';


// Hàm kiểm tra số nguyên tố
function isPrime(num : number) {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
}

// Hàm tính gcd(a, b)
function gcd(a : number, b : number) {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

// Hàm tìm modular inverse của a mod m
function modInverse(a: number, m : number) {
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) {
            return x;
        }
    }
    return 1;
}

// Hàm tạo số nguyên tố ngẫu nhiên trong khoảng [min, max]
function getRandomPrime(min : number, max : number) {
    let num;
    do {
        num = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (!isPrime(num));
    return num;
}


// Hàm tạo cặp khóa RSA
function generateRSAKeys() {
    let p, q, n, phiN, e, d;

    // Chọn 2 số nguyên tố ngẫu nhiên, p và q phải khác nhau
    do {
        p = getRandomPrime(100, 1000);
    } while (!isPrime(p));

    do {
        q = getRandomPrime(100, 1000);
    } while (!isPrime(q) || q === p);
    n = p * q;

    // Tính số Euler
    phiN = (p - 1) * (q - 1);

    // Tìm public key e
    e = 65537; // Chọn e = 65537 vì đây là số nguyên tố và không quá lớn (lựa chọn phổ biến)

    // Kiểm tra xem e và phi(n) có gcd là 1 hay không
    if (gcd(e, phiN) !== 1) {
        throw 'Public key không hợp lệ';
    }

    // Tính private key d
    d = modInverse(e, phiN);

    // Kiểm tra tính hợp lệ của khóa công khai và khóa riêng tư
    if ((e * d) % phiN !== 1) {
        throw 'Khóa công khai và khóa riêng tư không hợp lệ';
    }


    let publicKey = { e, n };
    let privateKey = { d, n };

    // Chuyển key thành chuỗi JSON và mã hóa thành base64
    let publicKeyBase64 = Buffer.from(JSON.stringify({ e, n })).toString('base64');
    let privateKeyBase64 = Buffer.from(JSON.stringify({ d, n })).toString('base64');

    return {
        publicKey: publicKeyBase64,
        privateKey: privateKeyBase64
    };
}



// Hàm tính a mũ b mod n
function powMod(a : bigint, b : bigint, n : bigint) {
    let result = BigInt(1);
    while (b > 0) {
        if (b % 2n === 1n) {
            result = result * a % n;
        }
        a = a * a % n;
        b = b / 2n;
    }
    return result;
}

// Hàm mã hóa một chuỗi và chuyển sang base64
function encryptRSA(message : string, publicKeyBase64 : string) {
    // Giải mã chuỗi Base64
    const decodedString = Buffer.from(publicKeyBase64, 'base64').toString('utf-8'); 
    // Chuyển đổi chuỗi JSON thành object
    const publicKey = JSON.parse(decodedString);
    let e = publicKey.e;
    let n = publicKey.n;
    let ciphertext = "";
    for (let i = 0; i < message.length; i++) {
        const charCode = message.charCodeAt(i); // Lấy mã Unicode của ký tự
        const encryptedChar = powMod(BigInt(charCode), BigInt(e), BigInt(n)); // Mã hóa ký tự
        ciphertext += encryptedChar.toString() + " "; // Thêm ký tự đã mã hóa vào chuỗi ciphertext, cách nhau bằng dấu cách
    }
    const base64Encoded = Buffer.from(ciphertext.trim()).toString('base64'); // Chuyển ciphertext sang base64
    return base64Encoded; // Trả về chuỗi base64
}

// Hàm giải mã một chuỗi base64 và trả về chuỗi gốc
function decryptRSA(base64Ciphertext : string, privateKeyBase64 : string) {
    // Giải mã chuỗi Base64
    const decodedString = Buffer.from(privateKeyBase64, 'base64').toString('utf-8'); 
    // Chuyển đổi chuỗi JSON thành object
    const privateKey = JSON.parse(decodedString);
    let d = privateKey.d;
    let n = privateKey.n;
    const ciphertext = Buffer.from(base64Ciphertext, 'base64').toString(); // Giải mã base64
    const encryptedChars = ciphertext.split(" "); // Tách chuỗi ciphertext thành mảng các ký tự đã mã hóa
    let decryptedMessage = "";
    for (let i = 0; i < encryptedChars.length; i++) {
        const decryptedCharCode = powMod(BigInt(encryptedChars[i]), BigInt(d), BigInt(n)).toString(); // Giải mã ký tự
        decryptedMessage += String.fromCharCode(parseInt(decryptedCharCode)); // Chuyển đổi mã đã giải mã sang ký tự và thêm vào chuỗi gốc
    }
    return decryptedMessage; // Trả về chuỗi gốc
}

export { generateRSAKeys, encryptRSA, decryptRSA };