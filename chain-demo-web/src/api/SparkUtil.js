/**
 * 计算文件md5 hash
 */
import SparkMD5 from 'spark-md5'
export default {
  /**
   * 计算文件hash
   * @param file
   * @returns {Promise<any>}
   */
  fileCalculateHash(file) {
    const promise = new Promise(function(resolve, reject) {
      let fileReader = new FileReader();
      // 文件分割方法（注意兼容性）
      let blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice;
      // 文件每块分割2M，计算分割详情
      let chunkSize = 2097152;
      let chunks = Math.ceil(file.size / chunkSize);
      let currentChunk = 0;
      // 创建md5对象（基于SparkMD5）
      let spark = new SparkMD5();
      // 每块文件读取完毕之后的处理
      fileReader.onload = function(e) {
        // 每块交由sparkMD5进行计算
        spark.appendBinary(e.target.result);
        currentChunk++;
        // 如果文件处理完成计算MD5，如果还有分片继续处理
        if (currentChunk < chunks) {
          loadNext();
        } else {
          resolve(spark.end());
        }
      };
      // 处理单片文件的上传
      let loadNext = function () {
        let start = currentChunk * chunkSize, end = start + chunkSize >= file.size ? file.size : start + chunkSize;
        fileReader.readAsBinaryString(blobSlice.call(file, start, end));
      }
      try {
        loadNext();
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }
}
